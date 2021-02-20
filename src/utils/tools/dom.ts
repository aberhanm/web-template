export function IsDomChild(tar: Element, parent: Element): boolean {
  let isChild = false;

  while (tar && tar !== parent && tar.tagName !== 'BODY') {
    tar = tar.parentElement as Element;
  }

  if (tar === parent) {
    isChild = true;
  }

  return isChild;
}

export function findClassParent(tar: HTMLElement, className: string) {
  let parent = null;

  while (tar && tar.tagName !== 'BODY') {
    if (tar.classList.contains(className)) {
      parent = tar;
      break;
    }
    tar = tar.parentElement as HTMLElement;
  }

  return parent;
}

/**
 *
 * @param tar dom元素
 * @param type 为0时不含padding，为1含padding，为2含border,为3含margin
 */
export function getELRect(tar: HTMLElement, type: 0 | 1 | 2 | 3 = 1) {
  if (type === 0) {
    const CStyle = getComputedStyle(tar);
    const pdTOP = parseInt(CStyle.paddingTop || '', 10) || 0;
    const pdBOTTOM = parseInt(CStyle.paddingBottom || '', 10) || 0;
    const pdLEFT = parseInt(CStyle.paddingLeft || '', 10) || 0;
    const pdRIGHT = parseInt(CStyle.paddingRight || '', 10) || 0;
    return  {
      height: tar.clientHeight - pdTOP - pdBOTTOM,
      width: tar.clientWidth - pdLEFT - pdRIGHT,
    };
  }
  if (type === 1) {
    return  {
      height: tar.clientHeight,
      width: tar.clientWidth,
    };
  }
  if (type === 2) {
    return  {
      height: tar.offsetHeight,
      width: tar.offsetWidth,
    };
  }
  if (type === 3) {
    const CStyle = getComputedStyle(tar);
    const mrTOP = parseInt(CStyle.marginTop || '', 10) || 0;
    const mrBOTTOM = parseInt(CStyle.marginBottom || '', 10) || 0;
    const mrLEFT = parseInt(CStyle.marginLeft || '', 10) || 0;
    const mrRIGHT = parseInt(CStyle.marginRight || '', 10) || 0;
    return  {
      height: tar.offsetHeight + mrTOP + mrBOTTOM,
      width: tar.offsetWidth + mrLEFT + mrRIGHT,
    };
  }
  return {
    height: 0,
    width: 0,
  };
}
