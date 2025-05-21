const IsUsername = (username: string) => {
    // Verificar si el valor no es una cadena
    if (typeof username !== 'string') {
        console.warn("The input is not a string");
        return false;
    }
    // Eliminar espacios en blanco al inicio y al final
    username = username.trim();
    const regex = /^[a-z]{1,20}$/;
    // Verificar si el valor no cumple con la expresión regular
    if (!regex.test(username)) {
      console.warn(`The input "${username}" is not a valid username`);
      return false;
    }
    return true;
};

const IsPassword = (password:string) => {
    // Expresión regular para validar contraseñas
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,;:!?'%$&#?¡@"()\[\]{}\-_*]).{8,}$/;
    // Verificar si el valor no es una cadena o no cumple con la expresión regular
    if (typeof password !== 'string' || !regex.test(password)) {
      console.warn("The input is not a valid password");
      return false;
    }
    return true;
};


const IsIata = (iata:string) => {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ0-9]{3}$/;
    if (typeof iata !== 'string' || !regex.test(iata)) {
      console.warn("The input is not a valid IATA code");
      return false;
    }
    return true;
};

const IsEmail = (email:string) => {
    // Expresión regular para validar un correo electrónico
    const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    // Verificar si el valor no es una cadena o no cumple con la expresión regular
    if (typeof email !== 'string' || !regex.test(email)) {
      console.warn("The input is not a valid E-Mail");
      return false;
    }
    return true;
};

const IsParagraph = (paragraph: string) => {
  // Verificar si el valor no es una cadena
  if (typeof paragraph !== 'string') {
      console.warn("The input is not a string");
      return false;
  }
  // Eliminar espacios en blanco al inicio y al final
  paragraph = paragraph.trim();
  // Expresión regular mejorada para validar párrafos
  const regex = /^[a-zA-Z0-9\s.,;:!?'"()\[\]{}\-_*\/&@#%^~|\\+=™°®©]{1,}$/;  
  // Verificar si el valor no cumple con la expresión regular
  if (!regex.test(paragraph)) {
      console.warn(`The input "${paragraph}" is not a valid paragraph`);
      return false;
  }
  return true;
};

const IsDecimal = (decimal:number) => {
    // Expresión regular para validar números decimales
    const regex = /^-?\d+(\,\d+)?$/;
    // Verificar si el valor no es una cadena o no cumple con la expresión regular
    if (typeof decimal !== 'string' || !regex.test(decimal)) {
        console.warn("The input is not a valid decimal number");
        return false;
    }
    return true;
}

const IsPhone = (phone:string) => {
    // Verificar si el valor no es una cadena
    if (typeof phone !== 'string') {
        console.warn("The input is not a string");
        return false;
    }
    // Eliminar espacios en blanco al inicio y al final (opcional, pero recomendado)
    phone = phone.trim();
    // Expresión regular para validar números de teléfono
    const regex = /^(?:\+56)? ?(?:9 ?)?\d{4}(?: ?\d{4})?$/;
    // Verificar si el valor no cumple con la expresión regular
    if (!regex.test(phone)) {
        console.warn(`The input "${phone}" is not a valid phone number`);
        return false;
    }
    return true;
}
export{
    IsUsername,
    IsPassword,
    IsIata,
    IsEmail,
    IsParagraph,
    IsDecimal,
    IsPhone,
}