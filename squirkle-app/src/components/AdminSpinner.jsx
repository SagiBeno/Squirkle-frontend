export default function AdminSpinner() {
    return (
        <>
            <div id='adminSpinner'></div>

            <style>
                {`
                    #adminSpinner {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 9999;
                        width: 100vw;
                        height: 100vh;
                        position: fixed;
                        top: 0;
                        background: rgba(0, 0, 0, 0.62);
                    }

                    #adminSpinner::after {
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