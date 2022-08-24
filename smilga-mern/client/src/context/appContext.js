import React, { useReducer, useContext } from 'react'
import axios from 'axios'
import reducer from './reducer'
import actions from './actions.js'

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: userLocation || '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
}
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // axios setup
  // axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
  const authFetch = axios.create({
    baseURL: '/api/v1',
  })
  // response interceptor
  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common['Authorization'] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  // response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log(error.response)
      if (error.response.status === 401) {
        logoutUser()
      }
      return Promise.reject(error)
    }
  )

  const displayAlert = () => {
    dispatch({ type: actions.DISPLAY_ALERT })
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: actions.CLEAR_ALERT,
      })
    }, 3000)
  }

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
    localStorage.setItem('location', location)
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('location')
  }

  const toggleSidebar = () => {
    dispatch({ type: actions.TOGGLE_SIDEBAR })
  }

  const logoutUser = () => {
    dispatch({ type: actions.LOGOUT_USER })
    removeUserFromLocalStorage()
  }

  const registerUser = async (currentUser) => {
    dispatch({ type: actions.REGISTER_USER_BEGIN })
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser)
      console.log(response)
      const { user, token, location } = response.data
      dispatch({
        type: actions.REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      })

      addUserToLocalStorage({
        user,
        token,
        location,
      })
    } catch (error) {
      console.log(error.response)
      dispatch({
        type: actions.REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const loginUser = async (currentUser) => {
    // console.log(currentUser)
    dispatch({ type: actions.LOGIN_USER_BEGIN })
    try {
      const response = await axios.post('/api/v1/auth/login', currentUser)
      console.log(response)
      const { user, token, location } = response.data
      dispatch({
        type: actions.LOGIN_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      })

      addUserToLocalStorage({
        user,
        token,
        location,
      })
    } catch (error) {
      // console.log(error.response)
      dispatch({
        type: actions.LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const updateUser = async (currentUser) => {
    dispatch({ type: actions.UPDATE_USER_BEGIN })
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)

      const { user, location, token } = data

      dispatch({
        type: actions.UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      })
      addUserToLocalStorage({ user, location, token })
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: actions.UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
    }
    clearAlert()
  }

  const handleChange = ({ name, value }) => {
    dispatch({
      type: actions.HANDLE_CHANGE,
      payload: { name, value },
    })
  }

  const clearValues = () => {
    dispatch({ type: actions.CLEAR_VALUES })
  }
  const createJob = async () => {
    dispatch({ type: actions.CREATE_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
      })
      dispatch({ type: actions.CREATE_JOB_SUCCESS })
      dispatch({ type: actions.CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: actions.CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: actions.GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: actions.GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (id) => {
    dispatch({ type: actions.SET_EDIT_JOB, payload: { id } })
  }
  const editJob = async () => {
    dispatch({ type: actions.EDIT_JOB_BEGIN })

    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      })
      dispatch({ type: actions.EDIT_JOB_SUCCESS })
      dispatch({ type: actions.CLEAR_VALUES })
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({
        type: actions.EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      })
    }
    clearAlert()
  }
  const deleteJob = async (jobId) => {
    dispatch({ type: actions.DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs()
    } catch (error) {
      logoutUser()
    }
  }

  const showStats = async () => {
    dispatch({ type: actions.SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch('/jobs/stats')
      dispatch({
        type: actions.SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const clearFilters = () => {
    dispatch({ type: actions.CLEAR_FILTERS })
  }
  const changePage = (page) => {
    dispatch({ type: actions.CHANGE_PAGE, payload: { page } })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
// make sure use
export const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider }
