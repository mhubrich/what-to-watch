/**
 * Exports helper functions:
 * - findChild (shallow search)
 * - filterChildren (shallow filter)
 * - findDeep (recursive search)
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

// Helper function to do a recursive deep search in the AST 
function findDeep(node, tag, attrName, attrValue) {
    // Check current node
    if (node.tagName === tag) {
        if (!attrName || !attrValue) return node;
        if (node.attrs && node.attrs.find(a => a.name === attrName && a.value === attrValue)) {
            return node;
        }
    }
    
    // Check children recursively
    if (node.childNodes) {
        for (const child of node.childNodes) {
            const found = findDeep(child, tag, attrName, attrValue);
            if (found) return found;
        }
    }
    return undefined;
}

module.exports = { findChild, filterChildren, findDeep };