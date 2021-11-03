const Utils = {
  class: {},

  getInstance: async (className) => {
    const key = className.getClassName();

    if (Utils.class[key]) {
      return Utils.class[key];
    }

    Utils.class[key] = await className.getInstance();

    return Utils.class[key];
  }
};

export default Utils;
