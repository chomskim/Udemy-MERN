import actions from './actions.js'
import { initialState } from './appContext'

const reducer = (state, action) => {
  if (action.type === actions.DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!',
    }
  }
  if (action.type === actions.CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    }
  }
  if (action.type === actions.REGISTER_USER_BEGIN) {
    return { ...state, isLoading: true }
  }
  if (action.type === actions.REGISTER_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Created! Redirecting...',
    }
  }
  if (action.type === actions.REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }

  if (action.type === actions.LOGIN_USER_BEGIN) {
    return { ...state, isLoading: true }
  }
  if (action.type === actions.LOGIN_USER_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      token: action.payload.token,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Login Successful! Redirecting...',
    }
  }
  if (action.type === actions.LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }
  if (action.type === actions.TOGGLE_SIDEBAR) {
    return { ...state, showSidebar: !state.showSidebar }
  }

  if (action.type === actions.LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      token: null,
      userLocation: '',
      jobLocation: '',
    }
  }

  if (action.type === actions.UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true }
  }

  if (action.type === actions.UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!',
    }
  }
  if (action.type === actions.UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }

  if (action.type === actions.HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    }
  }

  if (action.type === actions.CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editJobId: '',
      position: '',
      company: '',
      jobLocation: state.userLocation,
      jobType: 'full-time',
      status: 'pending',
    }

    return {
      ...state,
      ...initialState,
    }
  }
  if (action.type === actions.CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true }
  }

  if (action.type === actions.CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New Job Created!',
    }
  }
  if (action.type === actions.CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }
  if (action.type === actions.GET_JOBS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false }
  }
  if (action.type === actions.GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    }
  }
  if (action.type === actions.SET_EDIT_JOB) {
    const job = state.jobs.find((job) => job._id === action.payload.id)
    const { _id, position, company, jobLocation, jobType, status } = job
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    }
  }
  if (action.type === actions.DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true }
  }
  if (action.type === actions.EDIT_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    }
  }
  if (action.type === actions.EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Job Updated!',
    }
  }
  if (action.type === actions.EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }

  if (action.type === actions.SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    }
  }
  if (action.type === actions.SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    }
  }

  if (action.type === actions.CLEAR_FILTERS) {
    return {
      ...state,
      search: '',
      searchStatus: 'all',
      searchType: 'all',
      sort: 'latest',
    }
  }
  if (action.type === actions.CHANGE_PAGE) {
    return { ...state, page: action.payload.page }
  }

  throw new Error(`no such action :${action.type}`)
}
export default reducer
