import Container from "@/components/ui/design_system/container/Container";
import {LastStudied} from "@studo/types";

interface LastTenItemProps {
    data: LastStudied;
}

const LastTenItem = (props: LastTenItemProps) => {
    return ( <Container width="min-w-200 w-200" >
        <div></div>
    </Container>)
}

LastTenItem.displayName = "LastTenItem";
export default LastTenItem;