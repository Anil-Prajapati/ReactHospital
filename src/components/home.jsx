import { Link } from "react-router-dom";
import "../security/login.css"

export function HomeComponents() {
    return (
        <div className="backgroundColor" >
        <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-sm-6">
                <div className="card p-4 rounded-5 shadow bg-dark">
                    <h3 className='text-center fw-bold text-white'>Get Batter Delivery For Your <span className='text-info'>Product</span></h3>
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item">
                            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div class="accordion-body bg-dark text-white rounded-5">
                                    <strong className="text-danger">This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <Link to="/login"><button className='btn btn-outline-success' id='loginButton'>Login Here!</button></Link>
                        <Link to="/register"><button className='btn btn-outline-primary' id='registerButton'>Register Here!</button></Link>
                    </div>
                </div>
            </div>
        </div>
    </div >
    );
}
