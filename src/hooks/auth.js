import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            try {
                const res = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'access_token',
                        )}`,
                    },
                })
                return res.data
            } catch (error) {
                localStorage.removeItem('access_token')
                if (error.response.status !== 422) throw error
            }
        }

        return
    })

    const register = async ({ setErrors, ...props }) => {
        setErrors([])

        axios
            .post('/api/register', props)
            .then(res => {
                localStorage.setItem('access_token', res.data.data.token)
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const login = async ({ setErrors, setStatus, ...props }) => {
        setErrors([])
        setStatus(null)

        axios
            .post('api/login', props)
            .then(res => {
                setErrors([])
                localStorage.setItem('access_token', res.data.token)
                mutate()
            })
            .catch(error => {
                if (error.response.status == 401)
                    setErrors({
                        email: [error.response.data.message],
                    })

                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }

    const logout = async () => {
        if (!error) {
            await axios
                .post('api/logout', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'access_token',
                        )}`,
                    },
                })
                .then(() => {
                    localStorage.removeItem('access_token')
                    mutate()
                })
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        logout,
    }
}
