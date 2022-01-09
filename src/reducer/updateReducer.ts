import axios from 'axios';
import { defaultValue } from '../models/register_model';
import { IUpdateModel } from '../models/update_model';
import { ICrudPutAction } from '../type/redux-action';
import { IndexedObject } from '../utils/type';
import { FAILURE, REQUEST, SUCCESS } from './action-type.util';

export const ACTION_TYPES = {
  UPDATE_USER: 'fli_update/UPDATE_USER',
  RESET: 'fli_update/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUpdateModel>,
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  showModel: false,
};

export type UpdateState = Readonly<typeof initialState>;

// Reducer

export default (state: UpdateState = initialState, action: IndexedObject): UpdateState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPDATE_USER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };

    case FAILURE(ACTION_TYPES.UPDATE_USER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
        showModel: true,
      };

    case SUCCESS(ACTION_TYPES.UPDATE_USER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
        showModel: true,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

//api path
const apiUrl = 'users';

//dispatch update action
export const updateEntity: ICrudPutAction<IUpdateModel> = (entity) => async (dispatch) => {
  try {
    return await dispatch({
      type: ACTION_TYPES.UPDATE_USER,
      payload: axios.put(`https://jsonplaceholder.typicode.com/${apiUrl}/1`, entity),
    });
  } catch (e) {
    return null;
  }
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
