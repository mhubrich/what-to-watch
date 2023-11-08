/**
 * Exports two helper functions:
 * - findChild
 * - filterChildren
 * These functions are used by `router-streaming` and `router-search`.
 */


// Helper function to search for node children
function findChild(root, tag, attrName, attrValue) {
    return queryChildren("find", root, tag, attrName, attrValue);
}

// Helper function to filter node children
function filterChildren(root, tag, attrName, attrValue) {
    return queryChildren("filter", root, tag, attrName, attrValue);
}

// Helper function used by `findChild` and `filterChildren`
function queryChildren(func, root, tag, attrName, attrValue) {
    if (!["find", "filter"].includes(func)) return undefined;

    if (!root.childNodes) return undefined;
    
    // Apply `func` by tag name only
    if (!attrName || !attrValue) return root.childNodes[func](e => e.tagName === tag);

    // Apply `func` by tag name and attributes
    return root.childNodes[func](e => e.tagName === tag &&
                                e.attrs.find(a => a.name === attrName && a.value === attrValue));
}


module.exports = { findChild, filterChildren };