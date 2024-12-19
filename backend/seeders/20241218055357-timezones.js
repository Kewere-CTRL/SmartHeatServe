'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('timeZone', [
      {
        label: 'МСК-1 Калининград (UTC+2)',
      },
      {
        label: 'МСК   Москова (UTC+3)',
      },
      {
        label: 'МСК+1 Самара (UTC+4)',
      },
      {
        label: 'МСК+2 Екатеринбург (UTC+5)',
      },
      {
        label: 'МСК+3 Омск (UTC+6)',
      },
      {
        label: 'МСК+4 Красноярск (UTC+7)',
      },
      {
        label: 'МСК+5 Иркутск (UTC+8)',
      },
      {
        label: 'МСК+6 Якутск (UTC+9)',
      },
      {
        label: 'МСК+7 Владивосток (UTC+10)',
      },
      {
        label: 'МСК+8 Магадан (UTC+11)',
      },
      {
        label: 'МСК+9 Камчатский край (UTC+12)',
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('timeZone', null, {});
  }
};
