class UI {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.currentCategory = Object.keys(this.dataManager.categories)[0];

    // UI elements
    this.categoriesTabs = document.getElementById('categoriesTabs');
    this.offensesLists = document.getElementById('offensesLists');
    this.selectedOffensesList = document.getElementById('selectedOffensesList');
    this.totalTimeElement = document.getElementById('totalTime');
    this.copyTextArea = document.getElementById('copyTextArea');
    this.copyBtn = document.getElementById('copyBtn');

    // Profile checkboxes + fields
    this.profilePhatTu = document.getElementById('profilePhatTu');
    this.profileBaoLanh = document.getElementById('profileBaoLanh');
    this.bailInfo = document.getElementById('bailInfo');

    // Initialize UI
    this.initUI();
    this.setupEventListeners();
  }

  initUI() {
    this.renderCategories();
    this.renderOffenses();
    this.updateResults();
  }

  setupEventListeners() {
    // Copy
    this.copyBtn.addEventListener('click', () => this.copyText());
    
    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => location.reload());

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      this.searchOffenses(keyword);
    });

    // Hồ sơ tick
    this.profilePhatTu.addEventListener('change', () => {
      if (this.profilePhatTu.checked) {
        this.profileBaoLanh.checked = false;
        this.bailInfo.style.display = 'none';
      }
      this.generateProfile();
    });

    this.profileBaoLanh.addEventListener('change', () => {
      const bailAmount = this.dataManager.calculateBailAmount();
      if (this.profileBaoLanh.checked && bailAmount === 0) {
        alert('Tội danh không được bảo lãnh!');
        this.profileBaoLanh.checked = false;
        this.bailInfo.style.display = 'none';
      } else if (this.profileBaoLanh.checked) {
        this.profilePhatTu.checked = false;
        this.bailInfo.style.display = 'block';
      } else {
        this.bailInfo.style.display = 'none';
      }
      this.generateProfile();
    });

    // Các input ảnh hưởng đến mẫu hồ sơ
    ['bailPerson', 'bailAmountInput', 'profileName', 'profileCCCD', 'profileTangVat', 'profileNote'].forEach(id => {
      document.getElementById(id).addEventListener('input', () => this.generateProfile());
    });

    // Chọn danh mục
    this.categoriesTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-tab')) {
        this.changeCategory(e.target.dataset.category);
      }
    });

    // Chọn tội danh
    this.offensesLists.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        const offenseId = e.target.dataset.id;
        const countInput = document.querySelector(`input[data-count-id="${offenseId}"]`);
        if (e.target.checked) {
          countInput.disabled = false;
          this.dataManager.selectOffense(offenseId, parseInt(countInput.value));
        } else {
          countInput.disabled = true;
          this.dataManager.unselectOffense(offenseId);
        }
        this.updateResults();
      } else if (e.target.type === 'number') {
        const offenseId = e.target.dataset.countId;
        const checkbox = document.querySelector(`input[data-id="${offenseId}"]`);
        if (checkbox.checked) {
          this.dataManager.selectOffense(offenseId, parseInt(e.target.value));
          this.updateResults();
        }
      }
    });
  }

  renderCategories() {
    this.categoriesTabs.innerHTML = '';
    Object.entries(this.dataManager.categories).forEach(([id, name]) => {
      const tab = document.createElement('div');
      tab.className = `category-tab ${id === this.currentCategory ? 'active' : ''}`;
      tab.dataset.category = id;
      tab.textContent = name;
      this.categoriesTabs.appendChild(tab);
    });
  }

  renderOffenses() {
    this.offensesLists.innerHTML = '';
    Object.keys(this.dataManager.categories).forEach(categoryId => {
      const list = document.createElement('div');
      list.className = `offenses-list ${categoryId === this.currentCategory ? 'active' : ''}`;
      list.dataset.category = categoryId;

      const offenses = this.dataManager.getCategoryOffenses(categoryId);
      if (offenses.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'empty-message';
        msg.textContent = 'Không có tội danh nào trong danh mục này';
        list.appendChild(msg);
      } else {
        offenses.forEach(offense => {
          const isSelected = this.dataManager.selectedOffenses[offense.id] !== undefined;
          const count = isSelected ? this.dataManager.selectedOffenses[offense.id] : 1;
          list.appendChild(this.createOffenseCard(offense, isSelected, count));
        });
      }

      this.offensesLists.appendChild(list);
    });
  }

 createOffenseCard(offense, isSelected, count) {
  const card = document.createElement('div');
  card.className = 'offense-card';

  const header = document.createElement('div');
  header.className = 'offense-header';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'offense-checkbox';
  checkbox.dataset.id = offense.id;
  checkbox.checked = isSelected;

  const nameElement = document.createElement('div');
  nameElement.className = 'offense-name';

  const keywords = ['vũ khí', 'phương tiện', 'giáp', 'hung khí', 'nắm đấm','chưa nghiêm trọng' ,'nghiêm trọng', 'cảnh sát'];
let highlightedName = offense.name;

keywords.forEach(keyword => {
  const regex = new RegExp(`(${keyword})`, 'ig');
  highlightedName = highlightedName.replace(
    regex, 
    '<span style="font-weight: bold; color: red;">$1</span>'
  );
});

nameElement.innerHTML = highlightedName;
  const timeElement = document.createElement('div');
  timeElement.className = 'offense-time';
  timeElement.textContent = `${offense.time} phút`;

  header.appendChild(checkbox);
  header.appendChild(nameElement);
  header.appendChild(timeElement);

  const countContainer = document.createElement('div');
  countContainer.className = 'offense-count';

  const countLabel = document.createElement('label');
  countLabel.textContent = 'Số lần:';

  const countInput = document.createElement('input');
  countInput.type = 'number';
  countInput.min = '1';
  countInput.value = count;
  countInput.dataset.countId = offense.id;
  countInput.disabled = !isSelected;

  countContainer.appendChild(countLabel);
  countContainer.appendChild(countInput);

  card.appendChild(header);
  card.appendChild(countContainer);

  return card;
}


  changeCategory(categoryId) {
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === categoryId);
    });
    document.querySelectorAll('.offenses-list').forEach(list => {
      list.classList.toggle('active', list.dataset.category === categoryId);
    });
    this.currentCategory = categoryId;
  }

updateResults() {
  const totalTime = this.dataManager.calculateTotalTime();
  this.totalTimeElement.textContent = `${totalTime} phút`;

  const bailAmount = this.dataManager.calculateBailAmount();
  const bailAmountElement = document.getElementById('bailAmount');
  bailAmountElement.textContent = bailAmount > 0 ? `${bailAmount.toLocaleString()}$` : 'Không được bảo lãnh';

  // 🌟 Tự động điền số tiền vào ô nhập "Số tiền bảo lãnh"
  document.getElementById('bailAmountInput').value = bailAmount > 0 ? bailAmount.toLocaleString() : '';

  // 🌟 Kiểm tra xem có tội ngoài mức độ 1-2 không
  const selectedDetails = this.dataManager.getSelectedOffensesDetails();
  const hasNonBailable = selectedDetails.some(detail => {
    const catId = this.dataManager.findOffenseById(detail.id).categoryId;
    return catId !== 'level1' && catId !== 'level2';
  });

  // 🌟 Ẩn hoặc hiện nút checkbox Hồ sơ bảo lãnh
  const bailCheckbox = document.getElementById('profileBaoLanh').parentElement;
  if (hasNonBailable) {
    bailCheckbox.style.display = 'none';
    this.profileBaoLanh.checked = false;
    document.getElementById('bailInfo').style.display = 'none';
  } else {
    bailCheckbox.style.display = 'inline-block';
  }

  this.generateProfile();
  this.renderSelectedOffenses();
}


generateProfile() {
  const name = document.getElementById('profileName').value || 'Chưa có';
  const cccd = document.getElementById('profileCCCD').value || 'Chưa có';
  const tangVat = document.getElementById('profileTangVat').value.trim();
  const note = document.getElementById('profileNote').value.trim();

  const selectedDetails = this.dataManager.getSelectedOffensesDetails();
  const offensesText = selectedDetails.map(o => o.count > 1 ? `${o.name} x${o.count}` : o.name).join(' + ');
  const totalTime = this.dataManager.calculateTotalTime();

  // Sử dụng padEnd cho lề phải gọn gàng (như table)
  let profile = '';
  profile += `Tên             : ${name}\n`;
  profile += `CCCD            : ${cccd}\n`;
  profile += `Tội danh        : ${offensesText}\n`;
  profile += `Mức án          : ${totalTime}p\n`;

  if (tangVat) {
    profile += `Tang vật        :\n${tangVat}\n`;
  }

  if (this.profileBaoLanh.checked) {
    const bailPerson = document.getElementById('bailPerson').value || 'Chưa có';
    const bailAmount = document.getElementById('bailAmountInput').value || 'Chưa có';
    profile += `Người bảo lãnh  : ${bailPerson}\n`;
    profile += `Số tiền bảo lãnh         : ${bailAmount}\n`;
  }

  if (note) {
    profile += `Note            : ${note}\n`;
  }

  profile += `Đã xử lý`;
  document.getElementById('profileResult').value = profile;
}


  renderSelectedOffenses() {
    this.selectedOffensesList.innerHTML = '';
    const selected = this.dataManager.getSelectedOffensesDetails();
    if (selected.length === 0) {
      const msg = document.createElement('li');
      msg.className = 'empty-message';
      msg.textContent = 'Chưa chọn tội danh nào';
      this.selectedOffensesList.appendChild(msg);
    } else {
      selected.forEach(offense => {
        const li = document.createElement('li');
        const name = document.createElement('span');
        name.className = 'selected-offense-name';
        name.textContent = offense.count > 1 ? `${offense.name} x${offense.count}` : offense.name;
        const time = document.createElement('span');
        time.className = 'selected-offense-time';
        time.textContent = `${offense.totalTime} phút`;
        li.appendChild(name);
        li.appendChild(time);
        this.selectedOffensesList.appendChild(li);
      });
    }
  }

  copyText() {
    const profileArea = document.getElementById('profileResult');
    profileArea.select();
    document.execCommand('copy');

    const original = this.copyBtn.textContent;
    this.copyBtn.textContent = 'Đã sao chép!';
    this.copyBtn.classList.add('copied');
    setTimeout(() => {
      this.copyBtn.textContent = original;
      this.copyBtn.classList.remove('copied');
    }, 2000);
  }

  removeVietnameseTones(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  }

  searchOffenses(keyword) {
    const keywordNormalized = this.removeVietnameseTones(keyword.toLowerCase());
    const offensesListsContainer = document.getElementById('offensesLists');

    if (!keyword.trim()) {
      this.renderOffenses();
      return;
    }

    const matches = [];
    for (const categoryId in this.dataManager.offenses) {
      this.dataManager.offenses[categoryId].forEach(offense => {
        const nameNormalized = this.removeVietnameseTones(offense.name.toLowerCase());
        if (nameNormalized.includes(keywordNormalized)) {
          matches.push(offense);
        }
      });
    }

    offensesListsContainer.innerHTML = '';
    const searchList = document.createElement('div');
    searchList.className = 'offenses-list active';

    if (matches.length === 0) {
      const msg = document.createElement('p');
      msg.className = 'empty-message';
      msg.textContent = 'Không tìm thấy tội danh phù hợp';
      searchList.appendChild(msg);
    } else {
      matches.forEach(offense => {
        const isSelected = this.dataManager.selectedOffenses[offense.id] !== undefined;
        const count = isSelected ? this.dataManager.selectedOffenses[offense.id] : 1;
        searchList.appendChild(this.createOffenseCard(offense, isSelected, count));
      });
    }

    offensesListsContainer.appendChild(searchList);
  }

  refreshUI() {
    this.renderCategories();
    this.renderOffenses();
    this.updateResults();
  }
}
