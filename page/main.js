const radioGroups = document.querySelectorAll('.radio-btn-group');


const input = document.querySelectorAll('input[type="number"]');


input.forEach(input => {
  
  const inputGroup = input.closest('.input-group');  
  input.addEventListener('focus', () => {


    inputGroup.style.color = 'green';
    inputGroup.classList.add('input_group_focus');

    const icon = inputGroup.querySelector('.icon');

    icon.classList.add('icon_focus');

  })

  input.addEventListener('blur', () => {
    inputGroup.classList.remove('input_group_focus');
    inputGroup.style.color = 'black';
    const icon = inputGroup.querySelector('.icon');
    icon.classList.remove('icon_focus');
  })

})


radioGroups.forEach(group => {
    const input = group.querySelector('input[type="radio"]');
    
    input.addEventListener('change', () => {
        // Quita la clase "selected" de todos los grupos
        radioGroups.forEach(g => g.classList.remove('selected'));
        
        // Añade la clase "selected" al grupo seleccionado
        if (input.checked) {
            group.classList.add('selected');
        }
    });
});


//CLEAR ALL

const clearAll = document.querySelector('.clear-all');
clearAll.addEventListener('click', () => {
    radioGroups.forEach(group => group.classList.remove('selected'));
    input.forEach(input => input.value = '');

    const results_empty = document.querySelector('.results-empty');
    const results_completed = document.querySelector('.results-completed');

    results_empty.style.display = 'flex';
    results_completed.style.display = 'none';
})


const btn_submit = document.querySelector('.calculate-button');

btn_submit.addEventListener('click', function() {
    let isValid = true;
    
    // Mortgage Amount Validation
    const mortgageAmount = document.getElementById('mortgage_amount');

    

    const mortgageAmountError = mortgageAmount.parentNode.nextElementSibling;
    if (!mortgageAmount.value || mortgageAmount.value <= 0) {

        const inputGroup = mortgageAmount.closest('.input-group');

        /*icon */
        
        const icon = inputGroup.children[0]

        icon.style.backgroundColor = '#d73329';
        icon.style.color="#d79e9a"
        /**/ 

        inputGroup.classList.add('input_group_error');
      mortgageAmountError.style.display = 'block';
      
      isValid = false;
    } else {
        const inputGroup = mortgageAmount.closest('.input-group');
        inputGroup.classList.remove('input_group_error');
        mortgageAmountError.style.display = 'none';


        /*icon */

        const icon = inputGroup.children[0]

        icon.style.backgroundColor = '#e4f3ff';
        icon.style.color="#445d67"

        /* */
    
    }

    // Mortgage Term Validation
    const mortgageTerm = document.getElementById('mortgage_term');
    const mortgageTermError = mortgageTerm.parentNode.nextElementSibling;
    if (!mortgageTerm.value || mortgageTerm.value <= 0) {

        const inputGroup = mortgageTerm.closest('.input-group');

        /*ICON*/

        const icon = inputGroup.children[1]

        icon.style.backgroundColor = '#d73329';
        icon.style.color="#d79e9a"

        /**/

        inputGroup.classList.add('input_group_error');

      mortgageTermError.style.display = 'block';

      isValid = false;
    } else {
        const inputGroup = mortgageTerm.closest('.input-group');
        inputGroup.classList.remove('input_group_error');
      mortgageTermError.style.display = 'none';



              /*icon */

              const icon = inputGroup.children[1]

              icon.style.backgroundColor = '#e4f3ff';
              icon.style.color="#445d67"
      
              /* */

    }

    // Interest Rate Validation
    const interestRate = document.getElementById('interest_rate');
    const interestRateError = interestRate.parentNode.nextElementSibling;
    if (!interestRate.value || (interestRate.value <= 0 || interestRate.value > 100)) {
        const inputGroup = interestRate.closest('.input-group');

        inputGroup.classList.add('input_group_error');

        const icon = inputGroup.children[1]

        icon.style.backgroundColor = '#d73329';
        icon.style.color="#d79e9a"
      
      
        interestRateError.innerHTML = "Please enter a valid interest rate";

      interestRateError.style.display = 'block';
      isValid = false;
    } else {
        const inputGroup = interestRate.closest('.input-group');
        inputGroup.classList.remove('input_group_error');
        
      interestRateError.style.display = 'none';


              /*icon */

              const icon = inputGroup.children[1]

              icon.style.backgroundColor = '#e4f3ff';
              icon.style.color="#445d67"
      
              /* */
    }

    // Mortgage Type Validation
    const mortgageTypeError = document.querySelector('.mortgage-type-options .error');
    const mortgageTypeSelected = document.querySelector('input[name="mortgage_type"]:checked');
    if (!mortgageTypeSelected) {
      mortgageTypeError.style.display = 'block';
     
      isValid = false;
    } else {
      mortgageTypeError.style.display = 'none';
    }

    // If all fields are valid, proceed with the calculation (or form submission)
    if (isValid) {

      const result =calculateMortage(mortgageAmount.value, mortgageTerm.value, interestRate.value, mortgageTypeSelected.value);
      const results_empty = document.querySelector('.results-empty');
      const results_completed = document.querySelector('.results-completed');
    

      const monthly_total = document.querySelector('.monthly-total');
      const total = document.querySelector('.total-amount');
      monthly_total.innerHTML = `$${result.pagoMensual}`;
      total.innerHTML = `$${result.pagoTotal}`;


      results_empty.style.display = 'none';
      results_completed.style.display = 'flex';
    // console.log(monthly_total)

    }else{
        const results_empty = document.querySelector('.results-empty');
        const results_completed = document.querySelector('.results-completed');
        results_empty.style.display = 'flex';
        results_completed.style.display = 'none';
    }
  });


  const calculateMortage = (monto, plazo, tasaInteres, tipoHipoteca) => {
    const tasaMensual = tasaInteres / 12 / 100;
    const plazoEnMeses = plazo * 12;
  
    if (tipoHipoteca === 'repayment') {
      // Cálculo para hipoteca con amortización (repayment)
      const pagoMensual = (monto * tasaMensual * Math.pow(1 + tasaMensual, plazoEnMeses)) /
        (Math.pow(1 + tasaMensual, plazoEnMeses) - 1);
      const pagoTotal = pagoMensual * plazoEnMeses;
  
      return {
        pagoMensual:pagoMensual.toLocaleString("es-MX"),
        pagoTotal:pagoTotal.toLocaleString('es-MX'),
      };
    } else if (tipoHipoteca === 'interest') {
      // Cálculo para hipoteca solo intereses
      const pagoMensual = monto * tasaMensual;
      const pagoTotal = pagoMensual * plazoEnMeses;
  
      return {
        pagoMensual: pagoMensual.toLocaleString('es-MX'),
        pagoTotal:pagoTotal.toLocaleString('es-MX'),
        // saldoFinal: monto, // El saldo final es igual al monto inicial
      };
    } else {
      return {
        error: 'Tipo de hipoteca no válido',
      };
    }
  }