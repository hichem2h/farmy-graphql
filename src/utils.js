

export const getValidationErrors = (error) => {
    let validationErrors = {}
      
    for (let key in error.errors) {
      validationErrors[key] = error.errors[key].message
    }

    return validationErrors
}