// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI with data manager
  const ui = new UI(dataManager);
  
  // Initialize Admin with data manager and UI
  const admin = new Admin(dataManager, ui);
});