import { Spinner, Button } from "@radix-ui/themes";
import { EnterIcon } from "@radix-ui/react-icons";
import { FaGoogle } from 'react-icons/fa'

export function DisabledLoadingButton( { text } ) {
    return (
        <Button
            variant="outline"
            mt="4"
            mb="3"
            size="3"
            radius="full"
            disabled
            color="pink"
            style={{
                width: '100%'
            }}
        >
            <Spinner loading />
            <EnterIcon width='20px' height='20px' /> {text}
        </Button>
    )
}

