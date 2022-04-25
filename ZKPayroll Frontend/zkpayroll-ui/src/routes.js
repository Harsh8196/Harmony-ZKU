import React from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Admin from  './component/Admin';
import Home from './component/Home';
import Employer from './component/Employer'
import Employee from './component/Employee'




function Routes(){
    return(
        <BrowserRouter>
            <Switch>
                <Route path='/' exact>
                    <Home/>
                </Route>
                <Route path='/admin'>
                    <Admin/>
                </Route>
                {/* <Route path='/claim/:contractAddress/:tokenId'>
                    <Claim/>
                </Route> */}
                <Route path='/employer'>
                    <Employer/>
                </Route>
                <Route path='/employee'>
                    <Employee/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Routes