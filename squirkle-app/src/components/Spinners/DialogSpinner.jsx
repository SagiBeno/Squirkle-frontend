export default function DialogSpinner() {
    return (
        <>
            <div id='dialogSpinner'></div>

            <style>
                {`
                    #dialogSpinner {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    #dialogSpinner::after {
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