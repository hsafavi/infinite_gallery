

export class RandomSize {
    public width: number;
    public height: number;
    private sizes = [[200,400],[200,300], [200,200], [200,500]]
    /**
     *
     */
    constructor() {
        const size = this.sizes[Math.floor(Math.random()*2)+Math.floor(Math.random()*2)]
       
        this.width = size[0]
        this.height = size[1]
        
    }
}
