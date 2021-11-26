import {Fragment} from "react";
import {default as UsersPage} from "../Components/Users/users";
import withWidth from "../HOC/withWidth/withWidth";

const Users = props => {

    return(
        <Fragment>
            <UsersPage />
        </Fragment>
    )
}

export default withWidth(Users);