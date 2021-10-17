import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {EmployeeComponent} from "./employee/employee.component";
import {EmployerComponent} from "./employer/employer.component";

const appRoutes:Routes = [
  { path: '', redirectTo:'/employer', pathMatch:'full'},
  { path: 'employer', component: EmployerComponent  },
  { path: 'employee', component: EmployeeComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
