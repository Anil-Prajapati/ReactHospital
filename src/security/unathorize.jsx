import { Link } from "react-router-dom"

export function UnathorizeComponent(){
    return(
        <div className="container-fluid">
            <h3 className="text-danger">Unthorize Credencial </h3>
            <p>
                <Link to="/login">Go_To_Login</Link>
            </p>
        </div>
    )
}