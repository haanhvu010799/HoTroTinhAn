class Admin {
  constructor(dataManager, ui) {
    this.dataManager = dataManager;
    this.ui = ui;
    this.currentAdminCategory = Object.keys(this.dataManager.categories)[0];
    
    // UI elements
    this.calculatorView = document.getElementById('calculatorView');
    this.adminView = document.getElementById('adminView');
    this.toggleAdminBtn = document.getElementById('toggleAdminBtn');
    this.backToCalculatorBtn = document.getElementById('backToCalculatorBtn');
    this.adminCategoriesTabs = document.getElementById('adminCategoriesTabs');
    this.adminOffensesList = document.getElementById('adminOffensesList');
    this.addOffenseBtn = document.getElementById('addOffenseBtn');
    
    // Modals
    this.addOffenseModal = document.getElementById('addOffenseModal');
    this.editOffenseModal = document.getElementById('editOffenseModal');
    this.deleteConfirmModal = document.getElementById('deleteConfirmModal');
    
    // Forms
    this.addOffenseForm = document.getElementById('addOffenseForm');
    this.editOffenseForm = document.getElementById('editOffenseForm');
    this.offenseCategorySelect = document.getElementById('offenseCategory');
    this.editOffenseCategorySelect = document.getElementById('editOffenseCategory');
    
    // Initialize admin UI
    this.initAdminUI();
    this.setupEventListeners();
  }
  
  // Initialize admin UI elements
  initAdminUI() {
    this.renderAdminCategories();
    this.renderAdminOffenses();
    this.populateCategorySelects();
  }
  
  // Setup event listeners for admin section
  setupEventListeners() {
    // Toggle between calculator and admin views
    this.toggleAdminBtn.addEventListener('click', () => {
      this.calculatorView.classList.remove('active');
      this.adminView.classList.add('active');
    });
    
    this.backToCalculatorBtn.addEventListener('click', () => {
      this.adminView.classList.remove('active');
      this.calculatorView.classList.add('active');
    });
    
    // Admin category tabs clicks
    this.adminCategoriesTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-tab')) {
        this.changeAdminCategory(e.target.dataset.category);
      }
    });
    
    // Add offense button
    this.addOffenseBtn.addEventListener('click', () => {
      this.showAddOffenseModal();
    });
    
    // Add offense form submission
    this.addOffenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddOffense();
    });
    
    // Edit offense form submission
    this.editOffenseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleEditOffense();
    });
    
    // Confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
      this.handleDeleteOffense();
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });
    
    // Admin offense actions (edit/delete)
    this.adminOffensesList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-offense-btn')) {
        const offenseId = e.target.dataset.id;
        this.showEditOffenseModal(offenseId);
      } else if (e.target.classList.contains('delete-offense-btn')) {
        const offenseId = e.target.dataset.id;
        this.showDeleteConfirmModal(offenseId);
      }
    });
  }
  
  // Render admin category tabs
  renderAdminCategories() {
    this.adminCategoriesTabs.innerHTML = '';
    
    Object.entries(this.dataManager.categories).forEach(([id, name]) => {
      const tabElement = document.createElement('div');
      tabElement.className = `category-tab ${id === this.currentAdminCategory ? 'active' : ''}`;
      tabElement.dataset.category = id;
      tabElement.textContent = name;
      
      this.adminCategoriesTabs.appendChild(tabElement);
    });
  }
  
  // Render admin offenses list
  renderAdminOffenses() {
    this.adminOffensesList.innerHTML = '';
    
    const offenses = this.dataManager.getCategoryOffenses(this.currentAdminCategory);
    
    if (offenses.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = 'Không có tội danh nào trong danh mục này';
      this.adminOffensesList.appendChild(emptyMessage);
    } else {
      offenses.forEach(offense => {
        const offenseItem = this.createAdminOffenseItem(offense);
        this.adminOffensesList.appendChild(offenseItem);
      });
    }
  }
  
  // Create admin offense item element
  createAdminOffenseItem(offense) {
    const item = document.createElement('div');
    item.className = 'admin-offense-item';
    
    const infoElement = document.createElement('div');
    infoElement.className = 'admin-offense-info';
    
    const nameElement = document.createElement('div');
    nameElement.className = 'admin-offense-name';
    nameElement.textContent = offense.name;
    
    const detailsElement = document.createElement('div');
    detailsElement.className = 'admin-offense-details';
    
    const timeElement = document.createElement('span');
    timeElement.textContent = `Thời gian: ${offense.time} phút`;
    
    detailsElement.appendChild(timeElement);
    
    infoElement.appendChild(nameElement);
    infoElement.appendChild(detailsElement);
    
    const actionsElement = document.createElement('div');
    actionsElement.className = 'admin-offense-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-secondary edit-offense-btn';
    editButton.textContent = 'Sửa';
    editButton.dataset.id = offense.id;
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger delete-offense-btn';
    deleteButton.textContent = 'Xóa';
    deleteButton.dataset.id = offense.id;
    
    actionsElement.appendChild(editButton);
    actionsElement.appendChild(deleteButton);
    
    item.appendChild(infoElement);
    item.appendChild(actionsElement);
    
    return item;
  }
  
  // Change the current admin category
  changeAdminCategory(categoryId) {
    // Update active class on tabs
    document.querySelectorAll('#adminCategoriesTabs .category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === categoryId);
    });
    
    this.currentAdminCategory = categoryId;
    this.renderAdminOffenses();
  }
  
  // Populate category select elements
  populateCategorySelects() {
    const categories = this.dataManager.categories;
    
    // Clear existing options
    this.offenseCategorySelect.innerHTML = '';
    this.editOffenseCategorySelect.innerHTML = '';
    
    // Add category options to both selects
    Object.entries(categories).forEach(([id, name]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      
      const optionClone = option.cloneNode(true);
      
      this.offenseCategorySelect.appendChild(option);
      this.editOffenseCategorySelect.appendChild(optionClone);
    });
  }
  
  // Show add offense modal
  showAddOffenseModal() {
    // Reset form
    this.addOffenseForm.reset();
    this.offenseCategorySelect.value = this.currentAdminCategory;
    
    // Show modal
    this.addOffenseModal.classList.add('active');
  }
  
  // Show edit offense modal
  showEditOffenseModal(offenseId) {
    const result = this.dataManager.findOffenseById(offenseId);
    
    if (result) {
      const { categoryId, offense } = result;
      
      // Populate form fields
      document.getElementById('editOffenseId').value = offense.id;
      document.getElementById('editOffenseName').value = offense.name;
      document.getElementById('editOffenseTime').value = offense.time;
      document.getElementById('editOffenseCategory').value = categoryId;
      
      // Show modal
      this.editOffenseModal.classList.add('active');
    }
  }
  
  // Show delete confirmation modal
  showDeleteConfirmModal(offenseId) {
    document.getElementById('deleteOffenseId').value = offenseId;
    this.deleteConfirmModal.classList.add('active');
  }
  
  // Close all modals
  closeAllModals() {
    this.addOffenseModal.classList.remove('active');
    this.editOffenseModal.classList.remove('active');
    this.deleteConfirmModal.classList.remove('active');
  }
  
  // Handle add offense form submission
  handleAddOffense() {
    const name = document.getElementById('offenseName').value.trim();
    const time = parseInt(document.getElementById('offenseTime').value);
    const categoryId = document.getElementById('offenseCategory').value;
    
    if (name && time > 0) {
      // Generate a unique ID
      const id = `${categoryId}_${Date.now()}`;
      
      // Add new offense
      this.dataManager.addOffense(categoryId, {
        id,
        name,
        time
      });
      
      // Refresh UI
      if (categoryId === this.currentAdminCategory) {
        this.renderAdminOffenses();
      }
      
      this.ui.refreshUI();
      this.closeAllModals();
    }
  }
  
  // Handle edit offense form submission
  handleEditOffense() {
    const id = document.getElementById('editOffenseId').value;
    const name = document.getElementById('editOffenseName').value.trim();
    const time = parseInt(document.getElementById('editOffenseTime').value);
    const newCategoryId = document.getElementById('editOffenseCategory').value;
    
    const result = this.dataManager.findOffenseById(id);
    
    if (result && name && time > 0) {
      const oldCategoryId = result.categoryId;
      
      // Update offense
      this.dataManager.updateOffense(oldCategoryId, newCategoryId, {
        id,
        name,
        time
      });
      
      // Refresh UI
      this.renderAdminOffenses();
      this.ui.refreshUI();
      this.closeAllModals();
    }
  }
  
  // Handle delete offense confirmation
  handleDeleteOffense() {
    const offenseId = document.getElementById('deleteOffenseId').value;
    const result = this.dataManager.findOffenseById(offenseId);
    
    if (result) {
      // Delete offense
      this.dataManager.deleteOffense(result.categoryId, offenseId);
      
      // Also remove from selected if it was selected
      this.dataManager.unselectOffense(offenseId);
      
      // Refresh UI
      this.renderAdminOffenses();
      this.ui.refreshUI();
      this.closeAllModals();
    }
  }
}

// Admin will be initialized in app.js