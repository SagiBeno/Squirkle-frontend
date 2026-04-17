export default function GameSpinner () {
  return (
    <>
      <div id='gameSpinner'></div>

      <style>
        {`
          #gameSpinner {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 5px;
          }

          #gameSpinner::after {
            content: '';
            height: 10px;
            width: 10px;
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