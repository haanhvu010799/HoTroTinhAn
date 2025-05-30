// Default categories and offenses data
const defaultCategories = {
  level1: "Mức độ 1",
  level2: "Mức độ 2",
  level3: "Mức độ 3",
  level4: "Mức độ 4", 
  // level5: "Mức độ 5",
  // level6: "Mức độ 6",
  riot: "Bạo loạn thành phố",
  hqAttack: "Tấn công trụ sở",
  intrusion: "Xâm nhập"
};

// Sample offenses data
const defaultOffenses = {
  level1: [
    { id: "l1_1", name: "Cản trở người thi hành công vụ ", time: 20 },
    { id: "l1_2", name: "Hỗ trợ đồng bọn, trợ giúp tội phạm ", time: 20 },
    { id: "l1_3", name: "Không giao nộp hung khí gây án ", time: 20 },
    { id: "l1_4", name: "Tàng trữ/sử dụng giáp ", time: 20 },
    { id: "l1_5", name: "Giả danh người Nhà Nước ", time: 20 },
    { id: "l1_6", name: "Gây rối trật tự nơi công cộng ", time: 20 },
    { id: "l1_7", name: "Trộm cắp tài sản công dân ", time: 20 },
    { id: "l1_8", name: "Phá hoại tài sản Nhà Nước ", time: 20 },
  ],
  level2: [
    { id: "l2_1", name: "Nhập cư trái phép", time: 30 },
    { id: "l2_2", name: "Tàng trữ chất cấm trái phép", time: 30 },
    { id: "l2_3", name: "Vu khống người khác", time: 30 },
    { id: "l2_4", name: "Có hành động, lời lẽ xúc phạm đến người khác ", time: 30 },
    { id: "l2_5", name: "Tàng trữ vũ khí trái phép ", time: 30 },
    { id: "l2_6", name: "Sử dụng vũ khí trái phép ", time: 30 },
    { id: "l2_7", name: "Sử dụng vũ khí nơi công cộng ", time: 30 },
    { id: "l2_8", name: "Gây rối trước khu vực trụ sở cơ quan Nhà Nước ", time: 30 },
    { id: "l2_9", name: "Sử dụng nắm đấm gây thương tích chưa nghiêm trọng ", time: 30 },
    { id: "l2_10", name: "Tấn công gây thương tích chưa nghiêm trọng ", time: 30 },
    { id: "l2_11", name: "Xâm nhập trụ sở, nơi làm việc của Ban ngành Nhà Nước ", time: 30 },

  ],
  level3: [
    { id: "l3_1", name: "Tấn công gây thương tích nghiêm trọng cho người khác", time: 60 },
    { id: "l3_2", name: "Tấn công sĩ quan cảnh sát gây thương tích nghiêm trọng", time: 60 },
    { id: "l3_3", name: "Tấn công sĩ quan cảnh sát gây thương tích chưa nghiêm trọng", time: 60 },
    { id: "l3_4", name: "Rao bán/ Hỏi mua, giao dịch vũ khí, vật phẩm cấm", time: 60 },
  ],
  level4: [
    { id: "l4_1", name: "Tấn công Cán bộ Cao cấp", time: 120 },
    { id: "l4_2", name: "Tấn công nhân viên Y Tế", time: 120 },
    { id: "l4_3", name: "Đe dọa, xúc phạm nhân viên Chính Phủ", time: 120 },
  ],
  // level5: [
  //   { id: "l5_1", name: "Giết người", time: 60 },
  //   { id: "l5_2", name: "Khủng bố", time: 70 },
  //   { id: "l5_3", name: "Bắt cóc tống tiền", time: 65 },
  // ],
  // level6: [
  //   { id: "l6_1", name: "Giết cảnh sát", time: 80 },
  //   { id: "l6_2", name: "Khủng bố quy mô lớn", time: 90 },
  //   { id: "l6_3", name: "Tội phạm có tổ chức", time: 85 },
  // ],
  riot: [
    { id: "r_1", name: "Bạo loạn Thành Phố", time: 200 },
    // { id: "r_2", name: "Tham gia bạo loạn", time: 60 },
    // { id: "r_3", name: "Cầm đầu bạo loạn", time: 90 },
  ],
  hqAttack: [
    { id: "hq_1", name: "Tấn công trụ sở Ban Ngành", time: 200 },
    // { id: "hq_2", name: "Tấn công nhà tù", time: 85 },
    // { id: "hq_3", name: "Tấn công cơ quan chính phủ", time: 90 },
  ],
  intrusion: [
    { id: "in_1", name: "Xâm nhập Nhà Tù trái phép", time: 180 },
    { id: "in_2", name: "Xâm nhập Quân Khu trái phép", time: 180 },
    { id: "in_3", name: "Xâm nhập Học Viện trái phép", time: 180 },
  ]
};

class DataManager {
  constructor() {
    this.categories = this.getCategories();
    this.offenses = this.getOffenses();
    this.selectedOffenses = {};
  }

  getCategories() {
    const savedCategories = localStorage.getItem('gta5rp_categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  }

  getOffenses() {
    const savedOffenses = localStorage.getItem('gta5rp_offenses');
    return savedOffenses ? JSON.parse(savedOffenses) : defaultOffenses;
  }

  saveCategories() {
    localStorage.setItem('gta5rp_categories', JSON.stringify(this.categories));
  }

  saveOffenses() {
    localStorage.setItem('gta5rp_offenses', JSON.stringify(this.offenses));
  }

  getCategoryOffenses(categoryId) {
    return this.offenses[categoryId] || [];
  }

  addOffense(categoryId, offense) {
    if (!this.offenses[categoryId]) {
      this.offenses[categoryId] = [];
    }
    this.offenses[categoryId].push(offense);
    this.saveOffenses();
  }

  updateOffense(oldCategoryId, newCategoryId, offense) {
    if (oldCategoryId !== newCategoryId) {
      this.offenses[oldCategoryId] = this.offenses[oldCategoryId].filter(
        item => item.id !== offense.id
      );
      
      if (!this.offenses[newCategoryId]) {
        this.offenses[newCategoryId] = [];
      }
      this.offenses[newCategoryId].push(offense);
    } else {
      const index = this.offenses[oldCategoryId].findIndex(
        item => item.id === offense.id
      );
      if (index !== -1) {
        this.offenses[oldCategoryId][index] = offense;
      }
    }
    
    this.saveOffenses();
  }

  deleteOffense(categoryId, offenseId) {
    this.offenses[categoryId] = this.offenses[categoryId].filter(
      offense => offense.id !== offenseId
    );
    this.saveOffenses();
  }

  findOffenseById(offenseId) {
    for (const categoryId in this.offenses) {
      const offense = this.offenses[categoryId].find(o => o.id === offenseId);
      if (offense) {
        return { categoryId, offense };
      }
    }
    return null;
  }

  selectOffense(offenseId, count) {
    this.selectedOffenses[offenseId] = count;
  }

  unselectOffense(offenseId) {
    delete this.selectedOffenses[offenseId];
  }

  getSelectedOffensesDetails() {
    const selectedDetails = [];
    
    for (const offenseId in this.selectedOffenses) {
      const count = this.selectedOffenses[offenseId];
      const result = this.findOffenseById(offenseId);
      
      if (result) {
        selectedDetails.push({
          id: offenseId,
          name: result.offense.name,
          time: result.offense.time,
          count: count,
          totalTime: result.offense.time * count
        });
      }
    }
    
    return selectedDetails;
  }

  calculateTotalTime() {
    const selectedDetails = this.getSelectedOffensesDetails();
    return selectedDetails.reduce((total, offense) => total + offense.totalTime, 0);
  }

  generateCopyText() {
    const selectedDetails = this.getSelectedOffensesDetails();
    const offenseTexts = selectedDetails.map(offense => {
      return offense.count > 1 ? `${offense.name} x${offense.count}` : offense.name;
    });
    
    const totalTime = this.calculateTotalTime();
    return offenseTexts.join(' + ') + (offenseTexts.length > 0 ? ` ` : '');


    // return offenseTexts.join(' + ') + (offenseTexts.length > 0 ? ` = ${totalTime} phút` : '');
  }

  resetSelectedOffenses() {
    this.selectedOffenses = {};
  }
}

const dataManager = new DataManager();