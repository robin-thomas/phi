const Utils = {
  class: {},

  // get a singleton util object for the requested class.
  getInstance: async (className) => {
    const key = className.getClassName();

    if (Utils.class[key]) {
      return Utils.class[key];
    }

    // object doesnt exist. Create it first.
    Utils.class[key] = await className.getInstance();

    return Utils.class[key];
  }
};

export default Utils;
