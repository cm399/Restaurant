import {Fragment} from "react";

import Hero from "../Components/Index/Hero/hero";
import Restaurants from "../Components/Index/Restaurants/restaurants";
import Features from "../Components/Index/Features/features";
import Feedback from "../Components/Index/Feedback/feedback";
import Contact from "../Components/Index/Contact/contact";
import withWidth from "../HOC/withWidth/withWidth";

const Index = props => {

    return(
        <Fragment>
            <Hero />
            <Restaurants />
            <Features />
            <Feedback />
            <Contact />
        </Fragment>
    )
}

export default withWidth(Index);