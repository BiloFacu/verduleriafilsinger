'use client'
import Link from "next/link"

function Header(){
return(
  <div className='bg-red-400 w-100 flex'>
    <div className='m-4'>
      <Link href='/'>
        <h2 className='text-lg text-white'>
          Productos
        </h2>
      </Link>
    </div>
    <div className="m-4">
      <Link href='/ventas'>
        <h2 className='text-lg text-white'>
          Ventas
        </h2>
      </Link>
    </div>
    <div className="m-4">
      <Link href='/clientes'>
        <h2 className='text-lg text-white'>
          Clientes
        </h2>
      </Link>
    </div>
    <div className="m-4">
      <Link href='/pagos'>
        <h2 className='text-lg text-white'>
          Pagos
        </h2>
      </Link>
    </div>
  </div>
)
}

export default Header