import {GET_CART, ADD_TO_CART_COOKIE, ADD_TO_CART_DB} from "../actions/actionCart";

const cartReducer = (state = [], action) => {

    switch(action.type){
        case GET_CART:
            return action.payload;
        case  ADD_TO_CART_COOKIE:
            return action.payload;
        case  ADD_TO_CART_DB:
        {
            if(action.payload && action.payload!==null){
                return [...state, action.payload];
            }else{
                return state;
            }
        }

        default:
            return state;
    }

};

export default cartReducer;
