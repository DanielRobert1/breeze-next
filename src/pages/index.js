import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            <Head>
                <title>Fuel Credit</title>
            </Head>

            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="hidden fixed top-0 right-0 px-6 py-4 sm:block">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="ml-4 text-sm text-white underline">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-white underline">
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="ml-4 text-sm text-white underline">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-center items-center pt-8 sm:justify-start sm:pt-0">
                        <h1 className="mb-3 text-white text-3xl	 text-center">
                            Fuel Credit
                        </h1>
                        <div className="ml-4 text-center text-sm text-gray-500 sm:text-right sm:ml-0">
                            By - Aigbe Daniel
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 items-center sm:justify-between" />
                </div>
            </div>
        </>
    )
}
