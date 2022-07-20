import { Link } from 'react-router-dom'
import main from '../assets/images/main.svg'

import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components'

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Aliquam maximus mauris imperdiet molestie placerat. Suspendisse egestas quam purus, sed facilisis leo
            egestas vitae. Donec ullamcorper eros nec magna tempor, sed elementum lacus feugiat. Integer sed nisl metus.
            Mauris malesuada elementum nisl, a suscipit felis feugiat eu. Nunc vitae fermentum lectus, et volutpat orci.
            Curabitur accumsan ullamcorper sapien, eget molestie velit imperdiet consectetur.
          </p>
          <Link to='/register' className='btn btn-hero'>
            Login / Register
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  )
}

export default Landing
