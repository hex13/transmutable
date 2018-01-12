"use strict";

const createStage = require('./legacy_createStage');
const { cloneAndApplyMutations } = require('./cloning');
const { Transform } = require('./legacy_transform');
const { transform } = require('./transform');
const Commit = require('./commit');
const { Stream } = require('./stream');

const errorChecks = {
    Transmutable: {
        commit(commit) {
            if (!(commit instanceof Commit)) throw new Error('Wrong argument passed to method Transmutable::commit()')
        }
    }
}

function Transmutable(o, hooks = {}) {
    this.state$ = Stream();
    this.target = o;
    this.commits = [];
    this.hooks = hooks;
    this.nextCommit = new Commit();

}

Transmutable.prototype.get = function() {
    return this.target;
}

Transmutable.prototype.run = function (handler) {
    const { mutations } = Transform(handler).run(this.target);
    return this.commit(new Commit(mutations));
}

Transmutable.prototype._applyCommit = function(commit) {
    this.target = cloneAndApplyMutations(this.target, commit.mutations);
}

Transmutable.prototype.commit = function commit(commit = this.nextCommit) {
    errorChecks.Transmutable.commit(commit);

    const prevTarget = this.target;

    this._applyCommit(commit);

    this.state$.publish(this.target, prevTarget);

    this.commits.push(commit);
    this.nextCommit = new Commit();
    this.hooks.onCommit && this.hooks.onCommit(this, commit);
    return this.target;
}


Transmutable.prototype.observe = function observe(...args) {
    const handler = typeof args[0] == 'function'? args[0] : args[1];
    const path = typeof args[0] == 'function'? null : args[0];
    return this.state$.subscribe(handler, path);
}

Transmutable.prototype.fork = function fork() {
    const t = new Transmutable(this.target);
    t.commits = this.commits.slice();
    return t;
}

Transmutable.prototype.merge = function merge(transmutable) {
    // TODO proposal:
    // const track = new Track();
    for (let i = 0; i < transmutable.commits.length; i++) {
        this.nextCommit.mutations = transmutable.commits[i].mutations;
        if (this.commits.includes(transmutable.commits[i])) continue;
        // TODO proposal:
        // track.commit(transmutable.commits[i]);
        this.commit();
    }
}


exports.Transmutable = Transmutable;

exports.transform = require('./transform').transform;
exports.transform = require('./transform').transform;
exports.Reducer = require('./transform').Reducer;
