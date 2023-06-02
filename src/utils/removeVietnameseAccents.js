 const removeVietnameseAccents = (text) => {
    // Remove all accents from Vietnamese letters
    var newText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    // Replace all spaces with "-"
    newText = newText.replace(/\s+/g, "-");
  
    // Remove all non-alphabetic characters except "-" and lowercase everything
    newText = newText.replace(/[^a-zA-Z-]/g, "").toLowerCase();
  
    return newText;
  };

  module.exports = { removeVietnameseAccents }