import { AbstractControl } from '@angular/forms';

export class PasswordValidation {
    //CLASE QUE DEVOLVERA UN TRUE O FALSE
    static MatchPassword(AC: AbstractControl | any): void {
      //BUSCAR EL CONTENIDO DE LOS CAMPOS DEL HTML
        let password = AC.get('password').value;
        let confirmPassword = AC.get('confirmPassword').value;
        //SI NO COINCIDEN MUESTRO TRUE
        if (password != confirmPassword && confirmPassword.length > 0) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true });
        } else {
            return null
        }
    }
}
