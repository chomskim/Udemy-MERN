import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
}

const Register = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialState)
  const { user, isLoading, showAlert, displayAlert, registerUser, loginUser } = useAppContext()
  console.log(`Register user=${user}`)
  const handleChange = (e) => {
    // console.log(e.target)
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(values)
    const { name, email, password, isMember } = values
    if (!email || !password || (!isMember && !name)) {
      displayAlert()
      return
    }
    const currentUser = { name, email, password }
    if (isMember) {
      loginUser(currentUser)
    } else {
      registerUser(currentUser)
    }
  }

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }, [user, navigate])

  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        {/* control h3 */}
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {/* toggle name */}
        {!values.isMember && <FormRow type='text' name='name' value={values.name} handleChange={handleChange} />}

        {/* email input */}
        <FormRow type='email' name='email' value={values.email} handleChange={handleChange} />
        {/* password input */}
        <FormRow type='password' name='password' value={values.password} handleChange={handleChange} />

        <button type='submit' className='btn btn-block' disabled={isLoading}>
          submit
        </button>
        {/* toggle button */}

        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
  )
}

export default Register
