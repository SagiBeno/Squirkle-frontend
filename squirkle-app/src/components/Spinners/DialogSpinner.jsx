/**
 * Lightweight loading spinner for dialogs and smaller UI sections.
 *
 * Displays a centered animated spinner without a fullscreen overlay.
 * Intended for use inside dialogs, cards, or partial UI blocks where
 * only a specific section is loading.
 *
 * Uses inline CSS and a pseudo-element for the spinner animation.
 *
 * @component
 *
 * @example
 * {loading ? <DialogSpinner /> : <Content />}
 *
 * @returns { JSX.Element }
 */

export default function DialogSpinner() {
    return (
        <>
            <div className='dialogSpinner'></div>

            <style>
                {`
                    .dialogSpinner {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .dialogSpinner::after {
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