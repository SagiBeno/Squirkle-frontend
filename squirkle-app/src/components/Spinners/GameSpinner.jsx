/**
 * Small inline loading spinner for game UI elements.
 *
 * Displays a compact animated spinner intended for use
 * inside text, counters, or small UI components where
 * a subtle loading indicator is needed.
 *
 * Unlike other spinners, this one is minimal in size and
 * does not block layout or interaction.
 *
 * @component
 *
 * @example
 * <Text>Loading<GameSpinner /></Text>
 *
 * @returns { JSX.Elemen }
 */

export default function GameSpinner () {
  return (
    <>
      <div className='gameSpinner'></div>

      <style>
        {`
          .gameSpinner {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 5px;
          }

          .gameSpinner::after {
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