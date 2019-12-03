(function() {
    new Vue({
        el: ".main",
        data: {
            images: [],
            imageId: location.hash.slice(1),
            title: "",
            description: "",
            username: "",
            file: null,
            showMoreButton: false,
            textMoreButton: "More results",
            uploadError: false
        },
        mounted: function() {
            let self = this;
            addEventListener("hashchange", function() {
                self.imageId = location.hash.slice(1);
            });
            axios
                .get("/images")
                .then(function(response) {
                    self.images = response.data;
                })
                .catch(function(error) {
                    console.log("error in axios get /images", error);
                });
        },
        methods: {
            dataUpload: function() {
                let self = this;
                console.log("self: ", self);
                let formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                console.log("formData: ", formData);
                axios
                    .post("/upload", formData)
                    .then(results => {
                        self.images.unshift(results.data.imageData[0]);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                        self.uploadError = false;
                        document.getElementById("file").value = "";
                    })
                    .catch(error => {
                        console.log("error in axios post /upload", error);
                        self.uploadError = true;
                    });
            },
            fileSelect: function(event) {
                this.file = event.target.files[0];
            },
            closeOverview: function() {
                this.imageId = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            },
            refreshImages: function(imageId) {
                let self = this;
                const newImages = self.images.filter(img => {
                    return img.id != imageId;
                });
                self.images = newImages;
            },
            getMoreImages: function() {
                let self = this;
                var lastId = this.images[this.images.length - 1].id;
                axios
                    .get("/load-more-images/" + lastId)
                    .then(results => {
                        this.images = this.images.concat(results.data);
                        const lastIdInResults =
                            results.data[results.data.length - 1].id;
                        if (lastIdInResults == results.data[0].lowest_id) {
                            self.showMoreButton = true;
                            self.textMoreButton = "No results left";
                        }
                    })
                    .catch(error => {
                        console.log(
                            "error in axios get /get-more-images",
                            error
                        );
                    });
            }
        }
    });
})();
