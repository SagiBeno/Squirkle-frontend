/**
 * Fullscreen loading spinner overlay for admin pages.
 *
 * Displays a centered animated spinner with a semi-transparent
 * dark background, blocking user interaction during loading states.
 *
 * Uses inline CSS and a pseudo-element for the spinner animation.
 *
 * @component
 *
 * @returns { JSX.Element }
 */

export default function AdminSpinner() {
    return (
        <>
            <div className='adminSpinner'></div>

            <style>
                {`
                    .adminSpinner {
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

                    .adminSpinner::after {
                        content: '';
                        height: 30px;
                        width: 30px;
                        border: 6px solid gray;
                        border-top-color: white;
                        border-radius: 50%;
                        animation: loading 0.75s ease infinite;
                    }

                    @keyframes loading {
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