
const getExpansionName = chapter => {
  switch (chapter) {
    case "schapter_1_0":
    case "schapter_1_1":
    case "schapter_1_2":
    case "schapter_1_3":
    case "schapter_1_4":
    case "schapter_1_5":
    case "schapter_1_6":
    case "schapter_1_7":
    case "schapter_1_8":
    case "schapter_1_9":
      return "Part_demo"
    case "schapter_1_10":
    case "schapter_1_11":
    case "schapter_1_12":
    case "schapter_1_13":
    case "schapter_1_14":
    case "schapter_1_15":
    case "schapter_1_16":
    case "schapter_1_17":
    case "schapter_1_18":
    case "schapter_1_19":
    case "schapter_1_20":
    case "schapter_1_21":
    case "schapter_1_22":
    case "schapter_1_23":
    case "schapter_1_24":
    case "schapter_1_25":
    case "schapter_1_26":
    case "schapter_1_27":
    case "schapter_1_28":
    case "schapter_1_29":
    case "schapter_1_30":
    case "schapter_1_31":
    case "schapter_1_32":
    case "schapter_1_33":
    case "schapter_1_34":
      return "Part_1"
    default:
      return "Part_2"
  }
}

module.exports = {
  getExpansionName
}