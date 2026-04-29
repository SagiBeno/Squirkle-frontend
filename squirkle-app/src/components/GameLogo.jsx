const GAME_LOGO_URL = "https://res.cloudinary.com/squirkle/image/upload/v1777450725/logo_voq28t.png";

/**
 * Game logo image.
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { string | number } [props.width="200px"] - Logo width.
 * @param { string } [props.className] - Optional CSS class.
 * @param { Object } [props.style] - Optional inline styles.
 *
 * @returns { JSX.Element } Squirkle logo image
 */
export default function GameLogo({ width = "200px", className, style }) {
    return (
        <img
            src={GAME_LOGO_URL}
            alt="Squirkle"
            className={className}
            style={{
                display: "block",
                width,
                maxWidth: "100%",
                height: "auto",
                ...style
            }}
        />
    )
}
