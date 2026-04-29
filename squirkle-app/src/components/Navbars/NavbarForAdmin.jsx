import { Button, DropdownMenu, Flex, Text } from "@radix-ui/themes";
import { DropdownNavbarButton } from "../Buttons";
import { RiMenuFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { GrGamepad } from "react-icons/gr";

/**
 * Navigation bar for the admin interface.
 *
 * Displays the admin label, current user's username,
 * and a dropdown menu with navigation options:
 * - Item management
 * - Metadata management
 * - Back to game
 * - Logout
 *
 * @component
 *
 * @param { Object } props - Component props
 * @param { Object } props.user - Current authenticated user
 * @param { string } props.user.username - Display username
 * @param { Function } props.signOut - Logs out the current user
 *
 * @returns { JSX.Element }
 */
export default function NavbarForAdmin({ user, signOut }) {

    const navigate = useNavigate();

    return (
        <Flex
            style={{
                height: 50,
                width: '100%',
                backgroundColor: '#656582',
                top: 0,
                position: 'fixed',
                fontFamily: "'Fredoka', sans-serif",
                zIndex: 999,
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >

            <Flex 
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'start',
                    marginLeft: '15px'
                }}
            >
                <Text size="4" style={{ color: "white", textTransform: 'uppercase', fontWeight: '500', letterSpacing: '2px' }}>Admin</Text>
            </Flex>

            <Flex
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'end',
                    gap: 15,
                    padding: 0
                }}
            >
                <Text size="4" style={{ color: "white" }}>{user.username}</Text>

                <DropdownMenu.Root>
                    <DropdownNavbarButton icon={<RiMenuFill size={25} />} />

                    <DropdownMenu.Content className="squirkleDropdown" style={{ width: 160, marginTop: -12, marginRight: -20, backgroundColor: "transparent" }}>

                        <Button className="squirkleButton" onClick={() => navigate('/admin/item-management')} style={{ padding: 10, height: '50px', backgroundColor: '#565676' }}>
                            <MdManageAccounts size={18} /> <Text>Item management</Text>
                        </Button>
                        <Button className="squirkleButton" onClick={() => navigate('/admin/metadata-management')} style={{ padding: 10, height: '50px', backgroundColor: '#565676' }}>
                            <MdManageAccounts size={18} /> <Text>Metadata management</Text>
                        </Button>
                        <Button className="squirkleButton" onClick={() => navigate('/game')} style={{ padding: 5, backgroundColor: '#565676', }}>
                            <GrGamepad size={18} /> <Text>Game</Text>
                        </Button>
                        <Button className="squirkleButton" onClick={signOut} style={{ padding: 5, backgroundColor: "#ee3c3c" }}>
                            <FiLogOut size={18} /> <Text>Logout</Text>
                        </Button>

                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>

        </Flex>
    )

}