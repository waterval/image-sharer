(function() {
    Vue.component("image-overview", {
        template: "#overview-template",
        props: ["id"],
        data: function() {
            return {
                comments: [],
                imageData: "",
                commentText: "",
                commentUsername: "",
                toDelete: false
            };
        },
        mounted: function() {
            this.getImageDataComments();
        },
        watch: {
            id: function() {
                this.getImageDataComments();
            }
        },
        methods: {
            commentUpload: function() {
                let self = this;
                axios
                    .post("/comments/" + self.id, {
                        commentUsername: this.commentUsername,
                        commentText: this.commentText
                    })
                    .then(results => {
                        self.comments.unshift(results.data.rows[0]);
                        self.commentText = "";
                        self.commentUsername = "";
                    })
                    .catch(error => {
                        console.log("error in axios post /comments/:id", error);
                    });
            },
            closeOverview: function() {
                this.$emit("close");
            },
            refreshImages: function() {
                this.$emit("refresh", this.id);
            },
            deleteImage: function() {
                let self = this;
                axios
                    .post("/delete/" + self.id)
                    .then(function(response) {
                        console.log(
                            "response in axios post /delete/:id",
                            response
                        );
                    })
                    .catch(function(error) {
                        console.log("error in axios post /delete/:id", error);
                    });
            },
            getImageDataComments: function() {
                let self = this;
                axios
                    .get("/image-overview/" + self.id)
                    .then(response => {
                        self.imageData = response.data;
                    })
                    .catch(error => {
                        console.log(
                            "error in axios get /image-overview/:id",
                            error
                        );
                    });

                axios
                    .get("/comments/" + self.id)
                    .then(function(response) {
                        self.comments = response.data;
                    })
                    .catch(function(error) {
                        console.log("error in axios get /comments/:id", error);
                    });
            }
        }
    });
})();
