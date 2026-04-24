/**
 * Global fullscreen loading overlay.
 *
 * Displays a centered animated spinner with a semi-transparent,
 * blurred background that blocks user interaction while the
 * application is in a loading state (e.g., route changes, API calls).
 *
 * Intended to be controlled via a global state (e.g. setAppLoader).
 *
 * @component
 *
 * @example
 * {isAppLoading && <AppLoader />}
 *
 * @returns { JSX.Element }
 */

export default function AppLoader() {
    return (
        <>
            <div className='appLoader'></div>

            <style>
                {`
                    .appLoader {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        width: 100vw;
                        height: 100vh;
                        position: fixed;
                        top: 0;
                        background: rgba(0, 0, 0, 0.62);
                        backdrop-filter: blur(3px);
                    }

                    .appLoader::after {
                        content: '';
                        height: 30px;
                        width: 30px;
                        border: 6px solid gray;
                        border-top-color: white;
                        border-radius: 50%;
                        animation: app-loading 0.75s ease infinite;
                    }

                    @keyframes app-loading {
                        from{
                            transform: rotate(0turn);
                        }

                        to {
                            transform: rotate(1turn)
                        }
                    }
                `}
            </style>
        </>
    );
}