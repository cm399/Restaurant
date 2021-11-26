import {default as PendingPage} from "../Components/Pending/pending";
import withWidth from "../HOC/withWidth/withWidth";

const Pending = props => {
    return(
        <PendingPage />
    )
}

export default withWidth(Pending);