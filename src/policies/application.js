module.exports = class ApplicationPolicy {

    constructor(user, record){
        this.user = user;
        this.record = record;
    }

    _isOwner() {
        return this.record && (this.record.userId == this.user.id);
    }

    _isAdmin() {
        return this.user && (this.user.role == "admin");
    }

    _isPremium() {
        return this.user && (this.user.role == "premium");
    }

    _isPublic() {
        return this.record.private == false;
    }

    new() {
        return this.user != null;
    }

    create() {
        return this.new();
    }

    show() {
        return this._isPublic() || this._isAdmin() || this._isPremium();
    }

    edit() {
        return this.new() && (this._isPublic() || this.private());
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.new() && (this._isOwner() || this._isAdmin());
    }

    private() {
        return this._isAdmin() || this._isPremium();
    }
}