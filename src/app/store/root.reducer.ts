import { ActionReducerMap } from '@ngrx/store';

import * as fromShopping from '../shopping-list/store/shopping.reducer'
import * as fromAuth from '../auth/store/auth.reducer'


export type AppState = {
    shopping: fromShopping.State,
    auth: fromAuth.State
}

export const rootReducer: ActionReducerMap<AppState> = {
    shopping: fromShopping.shoppingReducer,
    auth: fromAuth.authReducer
};