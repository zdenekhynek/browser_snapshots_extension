import chai from 'chai';
import chaiImmutable from 'chai-immutable';

chai.use(chaiImmutable);

global.chrome = {
  tabs: {
    executeScript: () => {},
    update: () => {},
  },
};
