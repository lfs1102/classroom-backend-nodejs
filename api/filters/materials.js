"use strict";

class MaterialsFilter {
  static parseMaterials(materials, base_url, default_branch) {
    let downloadBaseUrl = `${base_url}/raw/${default_branch}`;

    let results = [];
    for (let material of materials) {
      let result = MaterialsFilter.parseMaterial(material, downloadBaseUrl);
      if (result) results.push(result);
    }
    return results;
  }

  static parseMaterial(material, base_url) {
    if (material.name.indexOf('.') == 0 || material.name.indexOf("README.md") != -1) {
      return null;
    }

    material.item_type = 'material';
    material.download_url = `${base_url}/${material.name}`;
    delete material.type;
    delete material.mode;
    return material;
  }
}

module.exports = MaterialsFilter;