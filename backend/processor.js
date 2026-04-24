function processData(data) {
    const invalid_entries = [];
    const duplicate_edges = [];
    const seenEdges = new Set();
    const childParentMap = new Map();
    const validEdges = [];

    // STEP 1 — VALIDATION + DUPLICATES + MULTI-PARENT
    for (let raw of data) {
        let str = raw.trim();

        if (!/^[A-Z]->[A-Z]$/.test(str) || str[0] === str[3]) {
            invalid_entries.push(raw);
            continue;
        }

        if (seenEdges.has(str)) {
            if (!duplicate_edges.includes(str)) {
                duplicate_edges.push(str);
            }
            continue;
        }

        const [p, c] = str.split("->");

        // multi-parent case → ignore later parents
        if (childParentMap.has(c)) continue;

        childParentMap.set(c, p);
        seenEdges.add(str);
        validEdges.push([p, c]);
    }

    // STEP 2 — BUILD GRAPH
    const graph = {};
    const nodes = new Set();

    for (let [p, c] of validEdges) {
        if (!graph[p]) graph[p] = [];
        graph[p].push(c);
        nodes.add(p);
        nodes.add(c);
    }

    // STEP 3 — FIND ROOTS
    const children = new Set(validEdges.map(e => e[1]));
    let roots = [...nodes].filter(n => !children.has(n));

    // STEP 4 — DFS HELPERS
    const visitedGlobal = new Set();

    function dfs(node, visiting) {
        if (visiting.has(node)) return "cycle";

        visiting.add(node);
        visitedGlobal.add(node);

        let subtree = {};
        let depth = 1;

        for (let child of (graph[node] || [])) {
            const res = dfs(child, new Set(visiting));

            if (res === "cycle") return "cycle";

            subtree[child] = res.tree;
            depth = Math.max(depth, 1 + res.depth);
        }

        return { tree: subtree, depth };
    }

    const hierarchies = [];
    let total_trees = 0;
    let total_cycles = 0;
    let maxDepth = 0;
    let largest_tree_root = "";

    // STEP 5 — PROCESS ROOTED TREES
    for (let root of roots) {
        if (visitedGlobal.has(root)) continue;

        const res = dfs(root, new Set());

        if (res === "cycle") {
            total_cycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            total_trees++;

            if (
                res.depth > maxDepth ||
                (res.depth === maxDepth && root < largest_tree_root)
            ) {
                maxDepth = res.depth;
                largest_tree_root = root;
            }

            hierarchies.push({
                root,
                tree: { [root]: res.tree },
                depth: res.depth
            });
        }
    }

    // STEP 6 — HANDLE REMAINING COMPONENTS (GROUPED)
function exploreComponent(start) {
    const stack = [start];
    const component = new Set();

    while (stack.length) {
        const node = stack.pop();
        if (component.has(node)) continue;

        component.add(node);
        visitedGlobal.add(node);

        for (let child of (graph[node] || [])) {
            stack.push(child);
        }

        // also check reverse edges (important for cycle grouping)
        for (let [p, c] of validEdges) {
            if (c === node) stack.push(p);
        }
    }

    return component;
}

for (let node of nodes) {
    if (visitedGlobal.has(node)) continue;

    const component = exploreComponent(node);

    // pick lexicographically smallest node as root
    const root = [...component].sort()[0];

    total_cycles++;

    hierarchies.push({
        root,
        tree: {},
        has_cycle: true
    });
}

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
}

module.exports = processData;