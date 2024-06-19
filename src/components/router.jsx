import { Route, Routes } from "react-router-dom";
import { HomeComponents } from "./home";
import { LoginComponents } from "../security/login";
import { RegisterComponenets } from "../security/register";
import { UnathorizeComponent } from "../security/unathorize";
import { AdminComponent } from "../security/admin";
import { UserComponent } from "../security/user";
import { AddDoctorComponent } from "../security/addDoctor";
import { DeleteComponent } from "../security/delete";
import { UpdateDoctor } from "../security/updateDoctor";
import { DoctorMainPageComponent } from "../doctor/doctor-component";
import { PatientAppoimentComponent } from "../doctor/appoiment-details";
import { DescriptionUpdateComponent } from "../doctor/descriptionUpdate";
import { DashboardComponent } from "../doctor/dashboard";


export function MainComponents() {

    return (
        <div className="container-fluid">
            <Routes>
                <Route path="/" element={<HomeComponents />} />
                <Route path="/login" element={<LoginComponents />} />
                <Route path="/register" element={<RegisterComponenets />} />
                <Route path="/admin" element={<AdminComponent></AdminComponent>}></Route>
                <Route path="/user" element={<UserComponent></UserComponent>}></Route>
                <Route path="/unathorize" element={<UnathorizeComponent></UnathorizeComponent>}></Route>
                <Route path="/registerDoctor" element={<AddDoctorComponent></AddDoctorComponent>}></Route>
                <Route path="/delete/:idDelete" element={<DeleteComponent></DeleteComponent>}></Route>
                <Route path="/update/:id/:shiftTime/:doctorFee" element={<UpdateDoctor></UpdateDoctor>}></Route>
                <Route path="/user/doctor" element={<DoctorMainPageComponent></DoctorMainPageComponent>}></Route>
                <Route path="/patient/appoiment" element={<PatientAppoimentComponent></PatientAppoimentComponent>}></Route>
                <Route path="/descriptionUpdate/:id/:descriptionDetails" element={<DescriptionUpdateComponent></DescriptionUpdateComponent>}></Route>
                <Route path="/admin/dashboard" element={<DashboardComponent></DashboardComponent>}></Route>
              
            </Routes>
        </div>
    )
}